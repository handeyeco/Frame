(function() {

const width = document.getElementById('width')
width.addEventListener('input', handleRatioChange)

const height = document.getElementById('height')
height.addEventListener('input', handleRatioChange)

const fullscreen = document.getElementById('fullscreen')
fullscreen.addEventListener('click', toggleFullscreen)

const locked = document.getElementById('locked')
locked.addEventListener('change', toggleLocked)

const change = document.getElementById('change')
change.addEventListener('click', toggleShowUpload)

const uploadForm = document.getElementById('upload')
uploadForm.addEventListener('submit', changeImage)

const previewImg = document.getElementById('preview__img')

// Init Cropper element
const cropper = new Cropper(document.getElementById('image'), {
    aspectRatio: width.value/height.value,
    crop() {
        // When crop, manually set preview image
        // (Cropper has a bug with preview size)
        const url = this.cropper
            .getCroppedCanvas()
            .toDataURL('image/jpeg')
        previewImg.src = url
    },
    ready() {
        // Start locked and in move mode
        this.cropper.setDragMode('move')
        toggleLocked()
    }
})

// When users change width/height inputs
// update Cropper's aspect ratio
function handleRatioChange() {
    if (!width.value || !height.value) {
        return
    }

    cropper.setAspectRatio(width.value/height.value)
}

// Make preview fullscreen (esc to exit)
function toggleFullscreen() {
    let elem = document.getElementById('preview')

    if (!document.fullscreenElement) {
        elem.requestFullscreen()
            .catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
            });
    } else {
        document.exitFullscreen();
    }
}

// When locked, Cropper is frozen
// and inputs are disabled
function toggleLocked() {
    locked.checked ? cropper.disable() : cropper.enable()
    width.disabled = locked.checked
    height.disabled = locked.checked
    change.disabled = locked.checked

    if (locked.checked) {
        toggleShowUpload(false)
    }
}

// Change whether user has access
// to change image form
function toggleShowUpload(show) {
    if (show !== undefined) {
        uploadForm.style.display = show ? 'block' : 'none'
        return
    }

    uploadForm.style.display =
        uploadForm.style.display === 'none'
        ? 'block'
        : 'none' 
}

// Change the image displayed in Cropper
// (looks for URL first then file)
function changeImage(e) {
    e.preventDefault()
    const urlInputValue = e.target[0].value
    const fileInputValue = e.target[1].files[0]

    if (urlInputValue) {
        cropper.replace(urlInputValue)
    } else if (fileInputValue) {
        var reader = new FileReader()
        reader.onload = function (e) {
            cropper.replace(e.target.result)
        }
        reader.readAsDataURL(fileInputValue)
    }
}

})()