package routes

import (
	"backend/controllers"

	"github.com/go-chi/chi/v5"
)

func SeederRoutes() chi.Router {
	r := chi.NewRouter()

	seederController := controllers.SeederController{}

	r.Get("/", seederController.SeedApplication)

	return r
}
