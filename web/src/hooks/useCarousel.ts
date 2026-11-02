import useEmblaCarousel from 'embla-carousel-react'


export const useCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

    function next() {
        emblaApi?.scrollNext()
    }
    function prev() {
        emblaApi?.scrollPrev()
    }

    return { carouselRef: emblaRef, next, prev }

}