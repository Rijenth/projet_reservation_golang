package models

type Places struct {
	ID     uint   `gorm:"primaryKey" jsonapi:"primary,places"`
	Name   string `jsonapi:"attr,name"`
	Adress string `jsonapi:"attr,adress"`
	Model
}
