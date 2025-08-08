'use client';

interface ToggleSwitchProps {
    label: string;
    description?: string;
    icon: string;
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
    disabled?: boolean;
}

export function ToggleSwitch({
    label,
    description,
    icon,
    enabled,
    onToggle,
    disabled = false
}: ToggleSwitchProps) {
    return (
        <div className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg ${disabled ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                        {label}
                    </h4>
                    {description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => onToggle(e.target.checked)}
                    disabled={disabled}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );
}
