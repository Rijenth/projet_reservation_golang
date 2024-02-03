package models

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
