import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export type VibeType = 'Subjective'| 'Objective'| 'Assessment and Plan'| 'Description' | 'Treatment'| 'Physical Exam'

interface DropDownProps {
  vibe: VibeType;
  setVibe: (vibe: VibeType) => void;
}

let vibes: VibeType[] = ["Subjective", "Objective", "Assessment and Plan", "Description", "Treatment", "Physical Exam"];

export default function DropDown({ vibe, setVibe }: DropDownProps) {
  return (
    <Menu as="div" className="relative block text-left w-full">
      <div>
        <MenuButton className="inline-flex w-full justify-between items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black">
          {vibe}
          <ChevronUpIcon
            className="-mr-1 ml-2 h-5 w-5 ui-open:hidden"
            aria-hidden="true"
          />
          <ChevronDownIcon
            className="-mr-1 ml-2 h-5 w-5 hidden ui-open:block"
            aria-hidden="true"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute left-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        key={vibe}
      >
        <div className="">
          {vibes.map((vibeItem) => (
            <MenuItem key={vibeItem}>
              <button
                onClick={() => setVibe(vibeItem)}
                className={classNames(
                  "data-[focus]:bg-gray-100 data-[focus]:text-gray-900",
                  vibe === vibeItem ? "bg-gray-200" : "text-gray-700",
                  "px-4 py-2 text-sm w-full text-left flex items-center space-x-2 justify-between"
                )}
              >
                <span>{vibeItem}</span>
                {vibe === vibeItem ? (
                  <CheckIcon className="w-4 h-4 text-bold" />
                ) : null}
              </button>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
}
