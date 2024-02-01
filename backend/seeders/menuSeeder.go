package seeders

import (
	"backend/models"
	"backend/services"
	"math/rand"

	"github.com/bxcodec/faker/v3"
)

type MenuSeeder struct {
}

func (menuSeeder MenuSeeder) factory(restaurant *models.Restaurant, command *models.Command) *models.Menu {
	Price := rand.Intn(33) + 8

	var Menu = models.Menu{
		Name:         faker.Name(),
		Price:        float64(Price),
		RestaurantID: restaurant.ID,
		CommandID:    &command.ID,
	}
	return &Menu
}

func (menuSeeder MenuSeeder) Create(restaurant *models.Restaurant, command *models.Command) *models.Menu {
	var menu = *menuSeeder.factory(restaurant, command)

	services.GetConnection().Create(&menu)

	return &menu
}
