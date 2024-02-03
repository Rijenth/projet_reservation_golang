package models

import "strconv"

type Menu struct {
	ID           uint        `gorm:"primaryKey" jsonapi:"primary,menus"`
	Name         string      `jsonapi:"attr,name"`
	Price        float64     `jsonapi:"attr,price"`
	RestaurantID uint        `gorm:"not null" json:"-"`
	Restaurant   *Restaurant `jsonapi:"relation,restaurant"`
	CommandID    *uint       `json:"-"`
	Command      *Command    `jsonapi:"relation,command"`
	MenuItems    []*MenuItem `gorm:"many2many:menu_items_menus;" jsonapi:"relation,menu_items"`
	Model
}

func (menu *Menu) Fill(data map[string]string) {
	if data["name"] != "" && data["name"] != menu.Name {
		menu.Name = data["name"]
	}

	if data["price"] != "" {
		float, err := strconv.ParseFloat(data["price"], 64)

		if err == nil && float != menu.Price {
			menu.Price = float
		}
	}
}

func (menu *Menu) SetRestaurant(restaurant *Restaurant) {
	menu.RestaurantID = restaurant.ID
	menu.Restaurant = restaurant
}

func (menu *Menu) SetMenuItems(menuItems []*MenuItem) {
	menu.MenuItems = menuItems
}
