package routes

import (
	"backend/contexts"
	"backend/controllers"

	"github.com/go-chi/chi/v5"
)

func CommandRoutes() chi.Router {
	r := chi.NewRouter()

	commandController := controllers.CommandController{}

	r.With(contexts.CommandContext).Group(func(r chi.Router) {
		r.Get("/{commandId}", commandController.Get)
		r.Patch("/{commandId}", commandController.Update)
		r.Delete("/{commandId}", commandController.Delete)
	})

	return r
}
