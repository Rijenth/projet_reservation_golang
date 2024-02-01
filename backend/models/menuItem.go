package models

type MenuItem struct {
	ID           uint        `gorm:"primaryKey" jsonapi:"primary,menu_items"`
	Name		 string      `jsonapi:"attr,name"`
	Type		 string      `jsonapi:"attr,type"`
	Price        float64     `jsonapi:"attr,price"`
	Model
}

