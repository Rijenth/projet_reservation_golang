import React from 'react';
import { IMenuItem } from '../interfaces/IMenuItem';

interface ChoicePickerProps {
    menuItems: IMenuItem[];
    selectedMenuItems: IMenuItem[];
    setSelectedMenuItems: (selectedMenuItems: IMenuItem[]) => void;
}

const ChoicePicker: React.FC<ChoicePickerProps> = ({
    menuItems,
    setSelectedMenuItems,
    selectedMenuItems,
}) => {
    const handleMenuItemSelection = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        const selectedMenuItemId = e.target.value;
        const menuItem = menuItems.find(
            (item) => item.id === selectedMenuItemId
        );
        if (menuItem) {
            setSelectedMenuItems([...selectedMenuItems, menuItem]);
        }
    };

    return (
        <select
            className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={handleMenuItemSelection}
        >
            <option value="">Sélectionner</option>
            {menuItems &&
                menuItems.length > 0 &&
                menuItems.map((menuItem) => (
                    <option key={menuItem.id} value={menuItem.id}>
                        {menuItem.attributes.name}
                    </option>
                ))}
        </select>
    );
};

export default ChoicePicker;
