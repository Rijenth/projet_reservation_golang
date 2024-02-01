package seeders

import (
	"backend/models"
	"backend/services"

	"github.com/bxcodec/faker/v3"
)

type RestaurantSeeder struct {
}

func (restaurantSeeder RestaurantSeeder) factory(place *models.Place) *models.Restaurant {
	var restaurant = models.Restaurant{
		Name:    faker.Name(),
		PlaceID: place.ID,
	}

	return &restaurant
}

func (restaurantSeeder RestaurantSeeder) Create(place *models.Place, attributes map[string]string) *models.Restaurant {
	var restaurant = *restaurantSeeder.factory(place)

	if len(attributes) > 0 {
		for key, value := range attributes {
			switch key {
			case "name":
				restaurant.Name = value
			}
		}
	}

	services.GetConnection().Create(&restaurant)

	if restaurant.ID == 0 {
		return nil
	}

	return &restaurant
}