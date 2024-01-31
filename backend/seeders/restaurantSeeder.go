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

func (restaurantSeeder RestaurantSeeder) Create(place *models.Place) *models.Restaurant {
	var restaurant = *restaurantSeeder.factory(place)

	services.GetConnection().Create(&restaurant)

	return &restaurant
}
