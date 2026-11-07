'use client';

import { useGithubData } from '@/utils/use-github-data';
import ProjectCard from './project-card';

const Projects = () => {
  const { data, loading, error } = useGithubData();
  const projects = data?.projects ?? [];

  return (
    <div id='projects' className="relative z-50  my-12 lg:my-24">
      <div className="sticky top-10">
        <div className="w-[80px] h-[80px] bg-violet-100 rounded-full absolute -top-3 left-0 translate-x-1/2 filter blur-3xl  opacity-30"></div>
        <div className="flex items-center justify-start relative">
          <span className="bg-[#1a1443] absolute left-0  w-fit text-white px-5 py-3 text-xl rounded-md">
            PROJECTS
          </span>
          <span className="w-full h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="pt-24">
        {loading && (
          <p className="text-center text-gray-400">Loading projects...</p>
        )}

        {!loading && error && (
          <p className="text-center text-gray-400">
            Unable to load projects right now. Please try again later.
          </p>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="text-center text-gray-400">No projects found.</p>
        )}

        <div className="flex flex-col gap-6">
          {projects.slice(0, 4).map((project, index) => (
            <div
              id={`sticky-card-${index + 1}`}
              key={project.id ?? index}
              className="sticky-card w-full mx-auto max-w-2xl sticky"
            >
              <div className="box-border flex items-center justify-center rounded shadow-[0_0_30px_0_rgba(0,0,0,0.3)] transition-all duration-[0.5s]">
                <ProjectCard project={project} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
