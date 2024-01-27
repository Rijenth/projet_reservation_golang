package routes

import (
	"backend/contexts"
	"backend/controllers"

	"github.com/go-chi/chi/v5"
)

func CommandRoutes() chi.Router {
	r := chi.NewRouter()

	commandController := controllers.CommandController{}

	r.With(contexts.CommandContext).Get("/{commandId}", commandController.Get)
	r.With(contexts.CommandContext).Patch("/{commandId}", commandController.Update)
	r.With(contexts.CommandContext).Delete("/{commandId}", commandController.Delete)

	return r
}
