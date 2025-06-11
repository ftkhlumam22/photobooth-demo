import { Switch as HeadlessSwitch } from "@headlessui/react";

interface SwitchProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

const Switch = ({ enabled, onChange }: SwitchProps) => {
  return (
    <HeadlessSwitch
      checked={enabled}
      onChange={onChange}
      className={`${
        enabled ? "bg-blue-600" : "bg-gray-200"
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    >
      <span className="sr-only">Enable background removal</span>
      <span
        className={`${
          enabled ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </HeadlessSwitch>
  );
};

export default Switch;
