package models

type Command struct {
	ID                   uint        `gorm:"primaryKey" jsonapi:"primary,commands"`
	IdentificationNumber string      `gorm:"unique" jsonapi:"attr,identificationNumber"`
	Description          string      `jsonapi:"attr,description"`
	Status               string      `jsonapi:"attr,status"`
	Amount               float64     `jsonapi:"attr,amount"`
	RestaurantID         uint        `gorm:"not null" json:"-"`
	Restaurant           *Restaurant `jsonapi:"relation,restaurant"`
	Menus                []*Menu     `jsonapi:"relation,menus"`
	//MenuItem 		   *MenuItem   `jsonapi:"relation,menu_item"`

	Model
}
