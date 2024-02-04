package seeders

import (
	"backend/models"
	"backend/services"
	"fmt"
	"math/rand"

	"github.com/bxcodec/faker/v3"
)

type UserSeeder struct {
}

func (userSeeder UserSeeder) factory() *models.User {
	availableRoles := []string{"admin", "customer", "owner"}
	firstname := faker.FirstName()

	data := map[string]string{
		"first_name": firstname,
		"last_name":  faker.LastName(),
		"username":   firstname + faker.Word(),
		"password":   faker.Password(),
		"role":       availableRoles[rand.Intn(len(availableRoles))],
	}

	var user = models.User{}

	user.Fill(data)

	user.Password, _ = user.HashPassword()

	return &user
}

func (userSeeder UserSeeder) Create(attributes map[string]string) *models.User {
	var user = *userSeeder.factory()

	if len(attributes) > 0 {
		previousPassword := user.Password

		user.Fill(attributes)

		if previousPassword != user.Password {
			user.Password, _ = user.HashPassword()
		}
	}

	services.GetConnection().Create(&user)

	if user.ID == 0 {
		fmt.Println("Factory error: Cannot create user")

		return nil
	}

	return &user
}
