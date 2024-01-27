package main

import (
	"backend/contexts"
	"backend/models"
	"backend/routes"
	"backend/services"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

var connection *sql.DB
var router *chi.Mux

func init() {
	database := services.InitSqlConnection()

	con, err := database.DB()

	if err != nil {
		log.Fatal("An error occurred with the database connection: ", err)
	}

	database.AutoMigrate(models.GetModels()...)

	fmt.Println("Database connection established")

	connection = con
}

func main() {
	defer connection.Close()

	router = chi.NewRouter()

	router.Use(middleware.Recoverer)

	// routes unauthenticated
	router.Group(func(r chi.Router) {
		r.Mount("/", routes.AuthenticationRoutes())
	})

	// routes necessitant une authentification
	router.Group(func(r chi.Router) {
		r.Use(contexts.AuthContext)

		r.Mount("/users", routes.UserRoutes())
		r.Mount("/restaurants", routes.RestaurantRoutes())
		r.Mount("/places", routes.PlaceRoutes())
		r.Mount("/menus", routes.MenuRoutes())
		r.Mount("/commands", routes.CommandRoutes())
	})

	log.Fatal(http.ListenAndServe(":8000", router))
}
