import { IPostMenu } from '../interfaces/IPostMenu';

interface RestaurantMenuHandlerProps {
    showComponentCallback: (component: 'menu' | 'menu-item') => void;
}

export default function RestaurantMenuHandler({
    showComponentCallback,
}: RestaurantMenuHandlerProps): JSX.Element {
    const menu: IPostMenu = {
        data: {
            type: 'menus',
            attributes: {
                name: '',
            },
            relationships: {
                menu_items: [],
            },
        },
    };

    return (
        <div className="container min-w-[500px] max-w-[500px] w-1/2">
            {/* Menu creator */}
            <div className="flex flex-col space-y-4 border border-gray-200 p-4 rounded shadow-md h-auto">
                <h2 className="text-xl font-bold">
                    Créer un menu pour votre restaurant
                </h2>

                <p>
                    Composez le nouveau menu que vous souhaitez proposer à vos
                    clients.
                </p>

                <label htmlFor="menu-name">Nom du menu</label>
                <input
                    type="text"
                    name="menu-name"
                    className="border border-gray-300 rounded p-2"
                    placeholder="Nom du menu"
                    onChange={(e) => {
                        menu.data.attributes.name = e.target.value;
                    }}
                />

                <label htmlFor="">Entrée</label>
                <input
                    type="text"
                    name="menu-item-name"
                    className="border border-gray-300 rounded p-2"
                    placeholder="Nom de l'entrée"
                />

                <label htmlFor="">Plat</label>
                <input
                    type="text"
                    className="border border-gray-300 rounded p-2"
                    placeholder="Nom du plat"
                />

                <label htmlFor="">Dessert</label>
                <input
                    type="text"
                    className="border border-gray-300 rounded p-2"
                    placeholder="Nom du dessert"
                />

                <label htmlFor="">Boisson</label>
                <input
                    type="text"
                    className="border border-gray-300 rounded p-2"
                    placeholder="Nom de la boisson"
                    required
                />

                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800">
                    Créer un menu
                </button>

                <button
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800"
                    onClick={() => showComponentCallback('menu-item')}
                >
                    Ajouter un ingrédient à mon restaurant
                </button>
            </div>
        </div>
    );
}
