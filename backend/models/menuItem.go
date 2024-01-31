package models

type MenuItem struct {
	ID           uint        `gorm:"primaryKey" jsonapi:"primary,menu_items"`
	Name		 string      `jsonapi:"attr,name"`
	Type		 string      `jsonapi:"attr,type"`
	Price        float64     `jsonapi:"attr,price"`
	RestaurantID uint        `gorm:"not null" json:"-"`
	Restaurant   *Restaurant `jsonapi:"relation,restaurant"`
	MenuID       *uint       `json:"-"`
	Menu         *Menu       `jsonapi:"relation,menu"`
	MenuItems []MenuItem `gorm:"many2many:menu_items_menus;" jsonapi:"relation,menu_items"`
	Model
}

