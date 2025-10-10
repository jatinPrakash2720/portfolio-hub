import { getUser } from "@/services/userServices"
import TextTypeClient from "../client/TextTypeClient"
import LogoLoopClient from "../client/LogoLoopClient"
import PixelBlastClient from "../client/PixelBlastClient"
import Link from "next/link"
import { LeetCodeButton } from "../client/LeetCodeButton"
import { GitHubButton } from "../client/GitHubButton"
import { LinkedInButton } from "../client/LinkedInButton"

export default async function PortfolioPage() {
  const userData = await getUser("jatin")
  console.log(userData?.socialLinks?.linkedInProfile)

  const ComponentLoader = () => (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div
      className={`h-screen flex relative transition-colors duration-300 bg-black text-white}`}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <PixelBlastClient />
      </div>
      <div
        className={`absolute inset-0 z-0 pointer-events-none transition-colors duration-300 bg-purple-900/10`}
      />

      <main className="flex relative z-10 justify-center items-center p-4">
        {/* Mobile: 5x6 Grid, Tablet: 8x5, Desktop: 8x6 Grid */}
        <div className="relative grid grid-cols-5 grid-rows-6 md:grid-cols-8 md:grid-rows-5 lg:grid-rows-6 gap-3  h-full">
          {/* Description Box - Mobile: 2x3, Tablet: 6x3, Desktop: 6x4 */}
          <div
            className={`col-span-2 row-span-3 col-start-1 row-start-1 md:col-span-6 md:row-span-3 lg:col-span-6 lg:row-span-4 md:col-start-1 md:row-start-2 lg:row-start-2 rounded-2xl md:rounded-3xl border-2 p-3 md:p-4 lg:p-6 flex flex-col z-10 group hover:border-transparent transition-all duration-300 hover:bg-opacity-80 relative backdrop-blur-sm bg-[#0F0F0F]/80 border-purple-500/20`}
          >
            <h2 className="text-base md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 lg:mb-4 pointer-events-none relative z-0">
              About Me
            </h2>
            <div
              className={`leading-relaxed overflow-y-auto scrollbar-hide flex-1 font-light text-xs md:text-sm lg:text-base xl:text-lg tracking-wide relative z-0 text-white/80`}
            >
              <TextTypeClient text={userData?.bio || ""} />
           
            </div>
          </div>

          {/* Profile Image - Mobile: 3x2, Tablet: 2x3, Desktop: 2x4 */}
          <div
            className={`col-span-3 row-span-2 col-start-3 row-start-1 md:col-span-2 md:row-span-3 lg:row-span-4 md:col-start-7 md:row-start-1 lg:col-start-7 rounded-2xl md:rounded-3xl border-2 flex items-center justify-center z-10 group hover:border-transparent transition-all duration-300 hover:bg-opacity-80 relative backdrop-blur-sm overflow-hidden bg-[#0F0F0F]/80 border-purple-500/20`}
          >
            <img
              src={userData?.profilePictureUrl}
              alt={userData?.fullName}
              className="w-full h-full object-cover pointer-events-none relative z-0"
            />
          </div>

          {/* Tech Logos Strip - Mobile: 3x1, Tablet: 6x1, Desktop: 6x1 */}
          <div
            className={`col-span-3 row-span-1 col-start-3 row-start-5 md:col-span-6 md:row-span-1 md:col-start-1 md:row-start-1 lg:col-start-1 lg:row-start-1 rounded-2xl md:rounded-3xl border-2 overflow-hidden relative z-10 group hover:border-transparent transition-all duration-300 backdrop-blur-sm bg-[#0F0F0F]/80 border-purple-500/20`}
          >
            <div className="flex items-center h-full px-2 md:px-6">
              <LogoLoopClient techStack={userData?.techStack || []} />
            
            </div>
          </div>

          {/* LeetCode Button - Mobile: 3x1, Tablet: 2x1, Desktop: 2x1 */}
          <div className="col-span-3 row-span-1 col-start-1 row-start-4 md:col-span-2 md:row-start-5 lg:row-start-6 md:col-start-1 z-10">
            <LeetCodeButton
              leetcodeUsername={userData?.socialLinks?.leetcodeProfile || ""}
            />
          </div>

          {/* LinkedIn Button - Mobile: 5x1, Tablet: 2x1, Desktop: 2x1 */}
          <div className="col-span-5 row-span-1 col-start-1 row-start-6 md:col-span-2 md:row-start-5 lg:row-start-6 md:col-start-3 z-10">
            <LinkedInButton
              linkedinUrl={userData?.socialLinks?.linkedInProfile || ""}
            />
          </div>

          {/* GitHub Button - Mobile: 3x1, Tablet: 2x1, Desktop: 2x1 */}
          <div className="col-span-3 row-span-1 col-start-3 row-start-3 md:col-span-2 md:row-start-5 lg:row-start-6 md:col-start-5 z-10">
            <GitHubButton
              githubUsername={userData?.socialLinks?.githubProfile || ""}
            />
          </div>

          {/* Projects Button - Mobile: 2x1, Tablet: 2x1, Desktop: 2x1 */}
          <div className="col-span-2 row-span-1 col-start-4 row-start-4 md:col-span-2 md:row-start-4 lg:row-start-5 lg:col-start-7 md:col-start-7 z-10">
            <Link href="/projects">
              <button
                //   onClick={handleProjectsClick}
                className={`w-full h-full rounded-2xl lg:rounded-3xl border-2 p-2 lg:p-3 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 group relative hover:border-transparent backdrop-blur-sm bg-purple-500/15 border-purple-400/40`}
              >
                <div className="font-semibold text-xs lg:text-base group-hover:text-purple-400 transition-colors duration-300">
                  Projects
                </div>
                <div className="text-[10px] lg:text-sm font-light text-white/80">
                  Portfolio
                </div>
              </button>
            </Link>
          </div>
          {/* Contact Button - Mobile: 2x1, Tablet: 2x1, Desktop: 2x1 */}
          <div className="col-span-2 row-span-1 col-start-1 row-start-5 md:col-span-2 md:row-start-5 lg:row-start-6 lg:col-start-7md:col-start-7 z-10">
            <Link href="/contact">
              <button
                // onClick={handleContactClick}
                className={`w-full h-full rounded-2xl lg:rounded-3xl border-2 p-2 lg:p-3 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 group relative hover:border-transparent backdrop-blur-sm bg-purple-600/15 border-purple-500/40`}
              >
                <div className="font-semibold text-xs lg:text-base group-hover:text-purple-400 transition-colors duration-300">
                  Contact
                </div>
                <div className="text-[10px] lg:text-sm font-light text-white/80">
                  Get in Touch
                </div>
              </button>
            </Link>
          </div>

          {/* Empty space - Mobile: 2x2 (col 4-5, row 5-6) */}
          <div className="col-span-2 row-span-2 col-start-4 row-start-5 lg:hidden" />
        </div>
      </main>
    </div>
  )
}
