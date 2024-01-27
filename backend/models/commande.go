package models

type Commande struct {
	ID                   uint        `gorm:"primaryKey" jsonapi:"primary,commandes"`
	IdentificationNumber string      `gorm:"unique" jsonapi:"attr,identificationNumber"`
	Description          string      `jsonapi:"attr,description"`
	Status               string      `jsonapi:"attr,status"`
	Amount               float64     `jsonapi:"attr,amount"`
	RestaurantID         uint        `gorm:"not null" json:"-"`
	Restaurant           *Restaurant `jsonapi:"relation,restaurant"`
	//Menus                 []*Menu   `jsonapi:"relation,menus"`
	Model
}
