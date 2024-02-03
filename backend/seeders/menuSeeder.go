package seeders

import (
	"backend/models"
	"backend/services"
	"math/rand"
	"strconv"

	"github.com/bxcodec/faker/v3"
)

type MenuSeeder struct {
}

func (menuSeeder MenuSeeder) factory(restaurant *models.Restaurant) *models.Menu {
	price := rand.Intn(33) + 8

	var menu = models.Menu{}

	menu.Fill(map[string]string{
		"name":  faker.Name(),
		"price": strconv.Itoa(price),
	})

	menu.SetRestaurant(restaurant)

	return &menu
}

func (menuSeeder MenuSeeder) Create(restaurant *models.Restaurant, attributes map[string]string) *models.Menu {
	var menu = *menuSeeder.factory(restaurant)

	if len(attributes) > 0 {
		menu.Fill(attributes)
	}

	services.GetConnection().Create(&menu)

	if menu.ID == 0 {
		return nil
	}

	return &menu
}
