package models

import "strconv"

type MenuItem struct {
	ID           uint        `gorm:"primaryKey" jsonapi:"primary,menu_items"`
	Name         string      `gorm:"not null" jsonapi:"attr,name"`
	Type         string      `gorm:"not null" jsonapi:"attr,type"`
	Price        float64     `gorm:"not null" jsonapi:"attr,price"`
	RestaurantID uint        `gorm:"not null" json:"-"`
	Restaurant   *Restaurant `jsonapi:"relation,restaurant"`
	Menus        []*Menu     `gorm:"many2many:menu_items_menus;" jsonapi:"relation,menus"`
	Model
}

func (menuItem *MenuItem) Fill(data map[string]string) {
	if data["name"] != "" && data["name"] != menuItem.Name {
		menuItem.Name = data["name"]
	}

	if data["type"] != "" && data["type"] != menuItem.Type {
		menuItem.Type = data["type"]
	}

	if data["price"] != "" {
		float, err := strconv.ParseFloat(data["price"], 64)

		if err == nil && float != menuItem.Price {
			menuItem.Price = float
		}
	}
}

func (menuItem *MenuItem) SetRestaurant(restaurant *Restaurant) {
	menuItem.RestaurantID = restaurant.ID
	menuItem.Restaurant = restaurant
}
