package models

type User struct {
	ID        uint   `gorm:"primaryKey" jsonapi:"primary,users"`
	FirstName string `jsonapi:"attr,first_name"`
	LastName  string `jsonapi:"attr,last_name"`
	Username  string `gorm:"unique" jsonapi:"attr,username"`
	Password  string `jsonapi:"attr,password"`
	Model
}
