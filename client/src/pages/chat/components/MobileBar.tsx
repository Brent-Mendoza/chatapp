import { IoMdClose } from "react-icons/io"

type MobileBarProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isOpen: boolean
}

export default function MobileBar({ setIsOpen, isOpen }: MobileBarProps) {
  return (
    <div className="absolute border top-0 left-0 w-90 h-full z-10 flex-col p-4 bg-green-200 hidden max-[1380px]:flex">
      <div className="flex-1 flex flex-col overflow-y-auto scroll-smooth scrollbar-hide">
        <IoMdClose
          className="self-end text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        />
        <h2 className="mx-auto text-4xl font-semibold max-lg:text-3xl">
          Rooms
        </h2>
        <form className="mt-2 w-full flex items-center justify-center">
          <input
            type="text"
            className="px-2 py-1 border bg-white focus:outline-0 w-full"
            placeholder="Search..."
          />
        </form>
        {/* Dropdown */}

        <ul className="absolute top-[117px] left-1/2 w-full border-t-0 -translate-x-1/2 bg-white border mt-1 z-10 max-h-60 overflow-auto shadow-lg">
          <li className="px-2 py-1 hover:bg-green-300 cursor-pointer"></li>
        </ul>

        <div className="mt-5 flex flex-col gap-4 overflow-y-auto scroll-smooth scrollbar-hide">
          <div className="border p-2 rounded-xl bg-green-50">
            <h4 className="text-xl font-semibold"></h4>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  )
}
