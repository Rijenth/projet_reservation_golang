package seeders

import (
	"backend/models"
	"backend/services"
	"math/rand"

	"github.com/bxcodec/faker/v3"
)

type UserSeeder struct {
}

func (userSeeder UserSeeder) factory() *models.User {
	availableRoles := []string{"admin", "customer", "owner"}
	firstname := faker.FirstName()

	var user = models.User{
		FirstName: firstname,
		LastName:  faker.LastName(),
		Username:  firstname + faker.Word(),
		Password:  faker.Password(),
		Role:      availableRoles[rand.Intn(len(availableRoles))],
	}

	user.Password, _ = user.HashPassword()

	return &user
}

func (userSeeder UserSeeder) Create(attributes map[string]string) *models.User {
	var user = *userSeeder.factory()

	if len(attributes) > 0 {
		for key, value := range attributes {
			switch key {
			case "firstname":
				user.FirstName = value
			case "lastname":
				user.LastName = value
			case "username":
				user.Username = value
			case "password":
				user.Password = value
			case "role":
				user.Role = value
			}
		}
	}

	services.GetConnection().Create(&user)

	if user.ID == 0 {
		return nil
	}

	return &user
}
