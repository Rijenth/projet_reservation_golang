package models


type Menus struct  {
	ID uint `gorm:"primaryKey" jsonapi:"primary,menus"`
	Name string `jsonapi:"attr,name"`
	Price float64 `jsonapi:"attr,price"`
	UserID uint `gorm:"not null" json:"-"`
	User *User `jsonapi:"relation,user"`
	RestaurantID uint `gorm:"not null" json:"-"`
	Restaurant *Restaurant `jsonapi:"relation,restaurant"`
	//MenuItems []MenuItem `gorm:"many2many:menu_items_menus;" jsonapi:"relation,menu_items"`
	Model
}
