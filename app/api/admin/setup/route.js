import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// This route is for creating the initial admin user
export async function POST(request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validate input
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: 'Please provide name, email, and password' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Check if any admin user already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return NextResponse.json(
        { error: 'An admin user already exists' },
        { status: 400 }
      );
    }
    
    // Check if email is already in use
    const emailExists = await User.findOne({ email: body.email });
    if (emailExists) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      );
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    // Create the admin user
    const newAdmin = new User({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date()
    });
    
    // Save the admin user
    await newAdmin.save();
    
    // Return the admin user (without the password)
    const adminUser = newAdmin.toObject();
    delete adminUser.password;
    
    return NextResponse.json(adminUser, { status: 201 });
  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during setup' },
      { status: 500 }
    );
  }
} 