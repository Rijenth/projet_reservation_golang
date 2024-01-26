package models

type Place struct {
	ID          uint          `gorm:"primaryKey" jsonapi:"primary,places"`
	Name        string        `jsonapi:"attr,name"`
	Adress      string        `jsonapi:"attr,adress"`
	UserID      uint          `gorm:"not null" json:"-"`
	User        *User         `jsonapi:"relation,user"`
	Restaurants []*Restaurant `gorm:"foreignKey:PlaceID" jsonapi:"relation,restaurants"`
	Model
}