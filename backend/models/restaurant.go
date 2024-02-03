package models

type Restaurant struct {
	ID        uint        `gorm:"primaryKey" jsonapi:"primary,restaurants"`
	Name      string      `gorm:"unique" jsonapi:"attr,name"`
	PlaceID   uint        `gorm:"not null" json:"-"`
	Place     *Place      `gorm:"foreignKey:PlaceID" jsonapi:"relation,place"`
	Menus     []*Menu     `gorm:"foreignKey:RestaurantID" jsonapi:"relation,menus"`
	MenuItems []*MenuItem `gorm:"foreignKey:RestaurantID" jsonapi:"relation,menu_items"`
	Commands  []*Command  `gorm:"foreignKey:RestaurantID" jsonapi:"relation,commands"`
	Model
}

func (restaurant *Restaurant) Fill(data map[string]string) {
	if data["name"] != "" && data["name"] != restaurant.Name {
		restaurant.Name = data["name"]
	}
}

func (restaurant *Restaurant) SetPlace(place *Place) {
	restaurant.PlaceID = place.ID
	restaurant.Place = place
}
