import imgCarro from "../assets/goals/carro.jpg";
import imgDefault from "../assets/goals/default.jpg";
import imgEuropa from "../assets/goals/europa.jpg";
import imgIngles from "../assets/goals/ingles.jpg";
import imgNotebook from "../assets/goals/notebook.jpg";
import imgReserva from "../assets/goals/reserva.jpg";

/** Galeria de imagens ilustrativas para objetivos. */
export const GOAL_ILLUSTRATIONS = [
  { id: "reserva", src: imgReserva, label: "Poupança" },
  { id: "europa", src: imgEuropa, label: "Viagem" },
  { id: "notebook", src: imgNotebook, label: "Tecnologia" },
  { id: "ingles", src: imgIngles, label: "Estudos" },
  { id: "carro", src: imgCarro, label: "Carro" },
  { id: "default", src: imgDefault, label: "Meta" },
] as const;

export const DEFAULT_GOAL_IMAGE = imgDefault;

export function resolveGoalImage(imageUrl: string | undefined): string {
  if (!imageUrl) {
    return DEFAULT_GOAL_IMAGE;
  }
  return imageUrl;
}
