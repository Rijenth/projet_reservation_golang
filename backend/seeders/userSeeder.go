package seeders

import (
	"backend/models"
	"backend/services"
	"log"
	"math/rand"

	"github.com/bxcodec/faker/v3"
)

type UserFactory struct {
}

func (userFactory UserFactory) factory() *models.User {
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

func (userFactory UserFactory) Create() *models.User {
	var user = *userFactory.factory()

	services.GetConnection().Create(&user)

	if user.ID == 0 {
		log.Panic("An error occurred while creating a user")
	}

	return &user
}
