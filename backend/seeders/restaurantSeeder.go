package seeders

import (
	"backend/models"
	"backend/services"
	"fmt"

	"github.com/bxcodec/faker/v3"
)

type RestaurantSeeder struct {
}

func (restaurantSeeder RestaurantSeeder) factory(place *models.Place, user *models.User) *models.Restaurant {
	var restaurant = models.Restaurant{}

	restaurant.Fill(map[string]string{
		"name": faker.Name() + " restaurant",
	})

	restaurant.SetPlace(place)

	restaurant.SetUser(user)

	return &restaurant
}

func (restaurantSeeder RestaurantSeeder) Create(place *models.Place, user *models.User, attributes map[string]string) *models.Restaurant {
	if user.Role != "owner" {
		fmt.Println("Factory error: Cannot create a restaurant for a user that is not an owner")

		return nil
	}

	var restaurant = *restaurantSeeder.factory(place, user)

	if len(attributes) > 0 {
		restaurant.Fill(attributes)
	}

	services.GetConnection().Create(&restaurant)

	if restaurant.ID == 0 {
		fmt.Println("Factory error: Cannot create restaurant")

		return nil
	}

	return &restaurant
}
