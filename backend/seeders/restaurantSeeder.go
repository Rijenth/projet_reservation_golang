package seeders

import (
	"backend/models"
	"backend/services"

	"github.com/bxcodec/faker/v3"
)

type RestaurantSeeder struct {
}

func (restaurantSeeder RestaurantSeeder) factory(place *models.Place) *models.Restaurant {
	var restaurant = models.Restaurant{}

	restaurant.Fill(map[string]string{
		"name": faker.Name() + " restaurant",
	})

	restaurant.SetPlace(place)

	return &restaurant
}

func (restaurantSeeder RestaurantSeeder) Create(place *models.Place, attributes map[string]string) *models.Restaurant {
	var restaurant = *restaurantSeeder.factory(place)

	if len(attributes) > 0 {
		restaurant.Fill(attributes)
	}

	services.GetConnection().Create(&restaurant)

	if restaurant.ID == 0 {
		return nil
	}

	return &restaurant
}
