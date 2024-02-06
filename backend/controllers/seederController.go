package controllers

import (
	"backend/models"
	"backend/seeders"
	"encoding/json"
	"math/rand"
	"net/http"
	"strconv"
	"sync"
)

type SeederController struct {
}

func (controller *SeederController) SeedApplication(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	response := seedAdmin(w, r)

	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(response)
}

func seedAdmin(w http.ResponseWriter, r *http.Request) *map[string]string {
	w.Header().Set("Content-Type", "application/json")

	var userFactory seeders.UserSeeder
	var placeFactory seeders.PlaceSeeder
	var restaurantFactory seeders.RestaurantSeeder
	var menuFactory seeders.MenuSeeder
	var menuItemFactory seeders.MenuItemSeeder
	var commandFactory seeders.CommandSeeder

	response := map[string]string{
		"message":          "Application has been seeded",
		"ownerUsername":    "",
		"adminUsername":    "",
		"customerUsername": "",
	}

	var wg sync.WaitGroup

	adminUser := userFactory.Create(map[string]string{
		"role":     "admin",
		"password": "password",
	})

	response["adminUsername"] = adminUser.Username

	for i := 0; i < 3; i++ {
		place := placeFactory.Create(adminUser, map[string]string{
			"name": "Place " + adminUser.FirstName,
		})

		for j := 0; j < 3; j++ {

			wg.Add(1)

			go func(j int) {
				defer wg.Done()

				owner := userFactory.Create(map[string]string{
					"role":     "owner",
					"password": "password",
				})

				if response["ownerUsername"] == "" {
					response["ownerUsername"] = owner.Username
				}

				restaurant := restaurantFactory.Create(place, owner, map[string]string{
					"name": "Restaurant de " + owner.FirstName + " " + strconv.Itoa(j),
				})

				restaurantCustomers := []*models.User{}

				for k := 0; k < 3; k++ {
					restaurantCustomers = append(restaurantCustomers, userFactory.Create(map[string]string{
						"role":     "customer",
						"password": "password",
					}))

					if response["customerUsername"] == "" {
						response["customerUsername"] = restaurantCustomers[k].Username
					}
				}

				var menuItems = []models.MenuItem{}

				for k := 0; k < 10; k++ {
					price := rand.Float64()*5 + 3

					menuItems = append(menuItems, *menuItemFactory.Create(restaurant, map[string]string{
						"price": strconv.FormatFloat(price, 'f', 2, 64),
					}))
				}

				var menus = []models.Menu{}

				for l := 0; l < 3; l++ {
					randomMenuItems := []*models.MenuItem{}
					totalAmount := 0.0

					for m := 0; m < 3; m++ {
						randomIndex := rand.Intn(len(menuItems))

						randomMenuItems = append(randomMenuItems, &menuItems[randomIndex])

						totalAmount += menuItems[randomIndex].Price
					}

					menus = append(menus, *menuFactory.Create(restaurant, randomMenuItems, map[string]string{
						"name":  "Menu " + restaurant.Name + " " + strconv.Itoa(l),
						"price": strconv.FormatFloat(totalAmount, 'f', 2, 64),
					}))
				}

				numberOfMenus := rand.Intn(3) + 1
				selectedMenus := []*models.Menu{}

				for n := 0; n < numberOfMenus; n++ {
					randomIndex := rand.Intn(len(menus))

					selectedMenus = append(selectedMenus, &menus[randomIndex])
				}

				selectRestaurantCustomer := restaurantCustomers[rand.Intn(len(restaurantCustomers))]

				commandFactory.Create(restaurant, selectedMenus, selectRestaurantCustomer, map[string]string{})
			}(j)
		}
	}

	wg.Wait()

	return &response
}
