package routes

import (
	"backend/contexts"
	"backend/controllers"

	"github.com/go-chi/chi/v5"
)

func MenuRoutes() chi.Router {
	r := chi.NewRouter()

	menuController := controllers.MenuController{}

	r.With(contexts.MenuContext).Group(func(r chi.Router) {
		r.Get("/", menuController.Index)

		r.Get("/{menuId}", menuController.Get)
		r.Patch("/{menuId}", menuController.Update)
		r.Delete("/{menuId}", menuController.Delete)
	})

	return r
}
