import { NextResponse } from 'next/server';
import { contactConfig } from '@/lib/contact-config';
export const dynamic='force-dynamic';
export function GET(){const c=contactConfig();return NextResponse.json({siteKey:c.siteKey||'',ready:c.captchaReady},{headers:{'Cache-Control':'no-store'}})}
