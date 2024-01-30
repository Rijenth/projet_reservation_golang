package seeders

import (
	"backend/models"
	"backend/services"
	"fmt"
	"math/rand"

	"github.com/bxcodec/faker/v3"
)

type PlaceSeeder struct {
}

func (placeSeeder PlaceSeeder) factory(user *models.User) *models.Place {
	streetNames := []string{
		"rue de la paix",
		"rue de la liberté",
		"rue de la république",
		"rue de la mairie",
	}

	postalCodes := []string{
		"75001 Paris",
		"93100 Montreuil",
		"75002 Paris",
		"93110 Rosny-sous-Bois",
	}

	number := fmt.Sprintf("%d", rand.Intn(100))

	streetIndex := rand.Intn(len(streetNames))

	postalCodeIndex := rand.Intn(len(postalCodes))

	address := number + " " + streetNames[streetIndex] + " " + postalCodes[postalCodeIndex]

	var place = models.Place{
		Name:   faker.Name(),
		Adress: address,
		UserID: user.ID,
	}

	return &place
}

func (placeSeeder PlaceSeeder) Create(user *models.User) *models.Place {
	if user.Role != "admin" {
		return nil
	}

	var place = *placeSeeder.factory(user)

	services.GetConnection().Create(&place)

	return &place
}
