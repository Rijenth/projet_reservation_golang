package models

type Restaurant struct {
	ID      uint   `gorm:"primaryKey" jsonapi:"primary,restaurants"`
	Name    string `gorm:"unique" jsonapi:"attr,name"`
	PlaceID uint   `gorm:"not null" json:"-"`
	Place   *Place `gorm:"foreignKey:PlaceID" jsonapi:"relation,place"`
	// Menus		[]Menu		`gorm:"foreignKey:RestaurantID" jsonapi:"attr,menus"`
	// Commands		[]Command	`gorm:"foreignKey:RestaurantID" jsonapi:"attr,commands"`
	Model
}
