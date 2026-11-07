'use client';

import Image from 'next/image';
import { mergePersonalData } from '@/utils/data/personal-data';
import { useGithubData } from '@/utils/use-github-data';

export default function AboutSection() {
  const { data } = useGithubData();
  const profile = mergePersonalData(data?.profile);
  return <section id="about" className="site-about site-container" aria-labelledby="about-heading"><div className="site-about-copy"><p className="site-eyebrow">About me</p><h2 id="about-heading">Who I am?</h2><p>{profile.aboutText}</p></div><Image src={profile.profile} width={280} height={280} alt="Plan Ghimire" className="site-portrait" unoptimized /></section>;
}
