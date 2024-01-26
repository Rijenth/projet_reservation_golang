package main

import (
	"backend/contexts"
	"backend/controllers"
	"backend/models"
	"backend/responses"
	"backend/routes"
	"backend/services"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/google/jsonapi"
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

	router.Route("/", func(r chi.Router) {
		userController := controllers.UserController{}

		r.Post("/register", userController.Store)

		r.Post("/login", controllers.UserAuthenticationController)

		r.Get("/me", func(writer http.ResponseWriter, request *http.Request) {
			writer.Header().Set("Content-Type", jsonapi.MediaType)

			token := request.Header.Get("Authorization")

			if !strings.HasPrefix(token, "Bearer ") {
				responses.UnauthorizedResponse(writer, "Invalid token")

				return
			}

			bearerToken := token[7:]

			err := services.VerifyToken(&bearerToken)

			if err != nil {
				responses.UnauthorizedResponse(writer, "Invalid token")

				return
			}

			writer.WriteHeader(http.StatusOK)

			json.NewEncoder(writer).Encode(map[string]string{
				"message": "You are authenticated",
			})
		})
	})

	// routes necessitant une authentification
	router.Group(func(r chi.Router) {
		r.Use(contexts.AuthContext)

		r.Mount("/users", routes.UserRoutes())
		r.Mount("/restaurants", routes.RestaurantRoutes())
		r.Mount("/places", routes.PlaceRoutes())
	})

	// sur toutes les routes de types /places/...
	/* 	router.Route("/places", func(r chi.Router) { */

	/* 		r.Route("/{placeId}", func(r chi.Router) {
	r.Use(contexts.PlaceContext) */

	/* 			r.Get("/restaurants", func(writer http.ResponseWriter, request *http.Request) {
	   				restaurants.IndexRestaurantsController(writer, request)
	   			})
	   			r.Post("/restaurants", func(writer http.ResponseWriter, request *http.Request) {
	   				restaurants.StoreRestaurantController(writer, request)
	   			}) */
	/* 		}) */
	/* 	}) */

	log.Fatal(http.ListenAndServe(":8000", router))
}
