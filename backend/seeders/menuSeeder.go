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
	Price := rand.Intn(33) + 8

	var Menu = models.Menu{
		Name:         faker.Name(),
		Price:        float64(Price),
		RestaurantID: restaurant.ID,
	}
	return &Menu
}

func (menuSeeder MenuSeeder) Create(restaurant *models.Restaurant, attributes map[string]string) *models.Menu {
	var menu = *menuSeeder.factory(restaurant)

	if len(attributes) > 0 {
		for key, value := range attributes {
			switch key {
			case "name":
				menu.Name = value
			case "price":
				float, err := strconv.ParseFloat(value, 64)

				if err != nil {
					return nil
				}

				menu.Price = float64(float)

			}
		}
	}

	services.GetConnection().Create(&menu)

	if menu.ID == 0 {
		return nil
	}

	return &menu
}
