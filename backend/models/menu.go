package models

type Menu struct {
	ID           uint        `gorm:"primaryKey" jsonapi:"primary,menus"`
	Name         string      `jsonapi:"attr,name"`
	Price        float64     `jsonapi:"attr,price"`
	RestaurantID uint        `gorm:"not null" json:"-"`
	Restaurant   *Restaurant `jsonapi:"relation,restaurant"`
	CommandID    uint        `gorm:"not null" json:"-"`
	Command      *Command    `jsonapi:"relation,command"`
	//MenuItems []MenuItem `gorm:"many2many:menu_items_menus;" jsonapi:"relation,menu_items"`
	Model
}
