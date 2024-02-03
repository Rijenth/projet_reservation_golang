package models

import (
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID        uint   `gorm:"primaryKey" jsonapi:"primary,users"`
	FirstName string `jsonapi:"attr,first_name"`
	LastName  string `jsonapi:"attr,last_name"`
	Username  string `gorm:"unique" jsonapi:"attr,username"`
	Password  string
	Role      string `jsonapi:"attr,role"`
	Model
}

func (user *User) HashPassword() (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(user.Password), 14)

	return string(bytes), err
}

func (user *User) ComparePassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))

	return err == nil
}

func (user *User) Fill(data map[string]string) {
	if data["first_name"] != "" && data["first_name"] != user.FirstName {
		user.FirstName = data["first_name"]
	}

	if data["last_name"] != "" && data["last_name"] != user.LastName {
		user.LastName = data["last_name"]
	}

	if data["username"] != "" && data["username"] != user.Username {
		user.Username = data["username"]
	}

	if data["password"] != "" && data["password"] != user.Password {
		user.Password = data["password"]
	}

	if data["role"] != "" && data["role"] != user.Role {
		user.Role = data["role"]
	}
}
