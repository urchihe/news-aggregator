import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { setPrefs } from "../features/auth/authSlice";
import { useGetArticleFilterDataQuery } from "../features/news/newsApi"; // Import the query hook
import { SunIcon, NewspaperIcon } from "@heroicons/react/outline";

export default function SettingsPanel() {
    const [active, setActive] = useState(0);

    // Use the query hook to fetch filter data
    const { data, error, isLoading } = useGetArticleFilterDataQuery();

    return (
        <div className="flex h-full">
            <nav className="w-52 bg-gray-50 p-4">
                <SidebarButton
                    active={active === 0}
                    label="Appearance"
                    icon={<SunIcon className="h-6 w-6" />}
                    onClick={() => setActive(0)}
                />
                <p className="text-sm my-2">Customize feed</p>
                <SidebarButton
                    active={active === 1}
                    label="Categories"
                    icon={<NewspaperIcon className="h-6 w-6" />}
                    onClick={() => setActive(1)}
                />
                <SidebarButton
                    active={active === 2}
                    label="Sources"
                    icon={<NewspaperIcon className="h-6 w-6" />}
                    onClick={() => setActive(2)}
                />
                <SidebarButton
                    active={active === 3}
                    label="Keywords"
                    icon={<NewspaperIcon className="h-6 w-6" />}
                    onClick={() => setActive(3)}
                />
            </nav>

            <div className="flex-grow p-4">
                {active === 0 && <AppearanceSettings />}
                {active === 1 && (
                    <PreferredSourcesSettings
                        type="categories"
                        prefKey="preferredCategories"
                        label="Select categories you are interested in"
                        data={data} // Pass the fetched data here
                    />
                )}
                {active === 2 && (
                    <PreferredSourcesSettings
                        type="origins"
                        prefKey="preferredOrigins"
                        label="Select origins you are interested in"
                        data={data} // Pass the fetched data here
                    />
                )}
                {active === 3 && <PreferredKeywordsSettings />}
            </div>
        </div>
    );
}

function SidebarButton({ active, label, icon, onClick }: { active: boolean; label: string; icon: React.ReactNode; onClick: () => void }) {
    return (
        <button className={`flex items-center gap-2 p-2 w-full rounded-md ${active ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`} onClick={onClick}>
            {icon}
            {label}
        </button>
    );
}

function AppearanceSettings() {
    const dispatch = useDispatch<AppDispatch>();
    const { colorScheme, accentColor } = useSelector((state: RootState) => state.news);

    const handleChange = (key: string, value: string) => {
        dispatch(setPrefs({ key, value }));
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Appearance Settings</h3>
            <SettingDropdown
                label="Color Scheme"
                options={["light", "dark"]}
                value={colorScheme}
                onChange={(value) => handleChange("colorScheme", value)}
            />
            <SettingDropdown
                label="Accent Color"
                options={["red", "pink", "blue", "green", "yellow", "gray"]}
                value={accentColor}
                onChange={(value) => handleChange("accentColor", value)}
            />
        </div>
    );
}

function SettingDropdown({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) {
    return (
        <div className="mb-4">
            <label className="block mb-2">{label}</label>
            <select className="border p-2 rounded w-full" value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
}

function PreferredKeywordsSettings() {
    const dispatch = useDispatch<AppDispatch>();
    const preferences = useSelector((state: RootState) => state.prefs);
    const selectedKeywords = preferences.preferredKeywords?.split(",") || [];

    const handleChange = (keywords: string[]) => {
        dispatch(setPrefs({ key: "preferredKeywords", value: keywords.join(",") }));
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Preferred Keywords</h3>
            <input
                type="text"
                className="border p-2 rounded w-full"
                placeholder="Add keywords separated by commas"
                value={selectedKeywords.join(",")}
                onChange={(e) => handleChange(e.target.value.split(","))}
            />
        </div>
    );
}

function PreferredSourcesSettings({
      type,
      prefKey,
      data,
      label,
  }: {
    type: string;
    prefKey: string;
    data: any; // Adjust the type as needed
    label: string;
}) {
    const dispatch = useDispatch<AppDispatch>();
    const preferences = useSelector((state: RootState) => state.preferences);
    const selectedValues = preferences[prefKey]?.split(",") || [];

    const handleChange = (values: string[]) => {
        dispatch(setPrefs({ key: prefKey, value: values.join(",") }));
    };

    if (data === undefined) return <p>Loading...</p>;
    if (data?.error) return <p>Error loading data</p>;

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">{label}</h3>
            <select
                multiple
                className="border p-2 rounded w-full"
                value={selectedValues}
                onChange={(e) =>
                    handleChange(Array.from(e.target.selectedOptions, (option) => option.value))
                }
            >
                {data[type]?.map((item: string) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
    );
}
