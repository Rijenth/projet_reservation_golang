package main

import (
	"backend/contexts"
	"backend/controllers/places"
	"backend/controllers/restaurants"
	"backend/controllers/users"
	"backend/models"
	"backend/services"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

var router *chi.Mux

func main() {

	fmt.Println("Starting server on port 8080...")

	database := services.InitSqlConnection()

	connection, err := database.DB()

	if err != nil {
		log.Fatal("An error occurred with the database connection: ", err)
	}

	defer connection.Close()

	database.AutoMigrate(models.GetModels()...)

	router = chi.NewRouter()

	router.Use(middleware.Recoverer)

	// sur toutes les routes de types /users/...
	router.Route("/users", func(r chi.Router) {

		r.Route("/", func(r chi.Router) {
			r.Get("/", func(writer http.ResponseWriter, request *http.Request) {
				users.IndexUsersController(writer, request)
			})
			r.Post("/", func(writer http.ResponseWriter, request *http.Request) {
				users.StoreUserController(writer, request)
			})
		})

		r.Route("/{userId}", func(r chi.Router) {
			r.Use(contexts.UserContext)

			r.Get("/", users.GetUsersController)
			r.Patch("/", users.UpdateUsersController)
			r.Delete("/", users.DeleteUserController)

			r.Get("/places", func(writer http.ResponseWriter, request *http.Request) {
				places.IndexPlacesController(writer, request)
			})

			r.Post("/places", func(writer http.ResponseWriter, request *http.Request) {
				places.StorePlacesController(writer, request)
			})
		})
	})

	// sur toutes les routes de types /places/...
	router.Route("/places", func(r chi.Router) {

		r.Route("/{placeId}", func(r chi.Router) {
			r.Use(contexts.PlacesContext)

			r.Get("/restaurants", func(writer http.ResponseWriter, request *http.Request) {
				restaurants.IndexRestaurantsController(writer, request)
			})
			r.Post("/restaurants", func(writer http.ResponseWriter, request *http.Request) {
				restaurants.StoreRestaurantController(writer, request)
			})
		})
	})

	router.Route("/restaurants/{restaurantId}", func(r chi.Router) {
		r.Use(contexts.RestaurantContext)

		r.Get("/", restaurants.GetRestaurantController)
		r.Delete("/", restaurants.DeleteRestaurantController)
		r.Patch("/", restaurants.UpdateRestaurantController)
	})

	log.Fatal(http.ListenAndServe(":8000", router))
}
