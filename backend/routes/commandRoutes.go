package routes

import (
	"backend/contexts"
	"backend/controllers"

	"github.com/go-chi/chi/v5"
)

func CommandRoutes() chi.Router {
	r := chi.NewRouter()

	commandController := controllers.CommandController{}

	r.With(contexts.CommandeContext).Get("/{commandeId}", commandController.Get)
	r.With(contexts.CommandeContext).Patch("/{commandeId}", commandController.Update)
	r.With(contexts.CommandeContext).Delete("/{commandeId}", commandController.Delete)

	return r
}
