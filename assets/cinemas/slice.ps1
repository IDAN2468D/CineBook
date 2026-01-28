Add-Type -AssemblyName System.Drawing

$sourcePath = "assets\cinemas\grid.jpg"
$outputDir = "assets\cinemas"
$columns = 3
$rows = 4

if (-not (Test-Path $sourcePath)) {
    Write-Error "Source file not found: $sourcePath"
    exit 1
}

$image = [System.Drawing.Image]::FromFile($sourcePath)
$cellWidth = [int]($image.Width / $columns)
$cellHeight = [int]($image.Height / $rows)

Write-Host "Image Size: $($image.Width)x$($image.Height)"
Write-Host "Cell Size: ${cellWidth}x${cellHeight}"

$counter = 0

for ($r = 0; $r -lt $rows; $r++) {
    for ($c = 0; $c -lt $columns; $c++) {
        $rect = New-Object System.Drawing.Rectangle ($c * $cellWidth), ($r * $cellHeight), $cellWidth, $cellHeight
        $cropped = $image.Clone($rect, $image.PixelFormat)
        
        $outputPath = Join-Path $outputDir "cinema_$counter.jpg"
        $cropped.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        $cropped.Dispose()
        
        Write-Host "Saved $outputPath"
        $counter++
    }
}

$image.Dispose()
Write-Host "Done."
