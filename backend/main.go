package main

import (
	"backend/controllers"
	"backend/models"
	"backend/services"
	"context"
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

	router.Route("/users", func(r chi.Router) {

		r.Route("/", func(r chi.Router) {
			r.Post("/", func(writer http.ResponseWriter, request *http.Request) {
				controllers.CreateUser(writer, request)
			})
		})

		/* 		r.Route("/{userId}", func(r chi.Router) {
			r.Use(UserContext)
			r.Get("/", getArticle)
			r.Put("/", updateArticle)
			r.Delete("/", deleteArticle)
		}) */
	})

	log.Fatal(http.ListenAndServe(":8000", router))

}

func UserContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		userID := chi.URLParam(r, "userId")

		var user models.User

		database := services.GetConnection()

		database.First(&user, userID)

		if user.ID == 0 {
			http.Error(w, http.StatusText(404), 404)
			return
		}

		ctx := context.WithValue(r.Context(), "user", user)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
