import { FOOTER_CONSTANTS } from "@/constants"

export function SupportBanner() {
    return (
      <div className="bg-purple-600 py-4">
        <div className="container mx-auto px-4 flex md:px-16 flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-white text-lg text-center sm:text-left">{FOOTER_CONSTANTS.supportBanner.title}</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {FOOTER_CONSTANTS.supportBanner.buttons.map((button, index) => (
              <button 
                key={index} 
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition w-full sm:w-auto"
              >
                {button.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

