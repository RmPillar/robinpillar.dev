#define PI 3.1415926535897932384626433832795

#include ./noise.glsl;

vec3 voronoi(vec2 x, float time, float speed)
{
    // Tile the space
    vec2 integerCoord = floor(x);
    vec2 floatCoord = fract(x);

	  vec2 mg, mr;

    //----------------------------------
    // first pass: regular voronoi
    //----------------------------------
    
    // Set initial distance to something large
    float md = 100.0;

    // Loop through the 3x3 grid
    for( int j=-1; j<=1; j++ ) {
      for( int i=-1; i<=1; i++ ) {
        // Neighbor cell in the grid
        vec2 neighborCell = vec2(float(i), float(j));

        // Random position from current + neighbor place in the grid
        vec2 point = noise(integerCoord + neighborCell);

        // Animate the point position in a circle around the cell
        point = 0.5 + 0.5 * sin( time * speed + PI * 2.0 * point);

        // Vector between the pixel and the point
        vec2 diff = neighborCell + point - floatCoord;

        // Distance to the point
        float dist = length(diff);

        // Keep the closer distance 
        if (dist < md) {
          md = dist;
          mr = diff;
          mg = neighborCell;
        }
      }
    }

    //----------------------------------
    // second pass: distance to borders
    //----------------------------------

    // Set initial distance to something large
    md = 100.0;

    // Loop through the 5x5 grid
    for( int j=-2; j<=2; j++ ) {
      for( int i=-2; i<=2; i++ ) { 
        // Neighbor cell in the grid
        vec2 neighborCell = mg + vec2(float(i), float(j));

        // Random position from current + neighbor place in the grid
        vec2 point = noise(integerCoord + neighborCell);

        // Animate the point position in a circle around the cell
        point = 0.5 + 0.5 * sin(time * speed + PI * 2.0 * point);

        // Vector between the pixel and the point
        vec2 diff = neighborCell + point - floatCoord;

        // Distance to the point 
        float dist = dot(mr - diff, mr - diff);
        
        if(dist > 0.00001) {
          md = min( md, dot( 0.5*(mr+diff), normalize(diff-mr) ) );
        }
      }
    }

    return vec3(md, mr);
}