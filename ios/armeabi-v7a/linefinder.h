
/**
 * 
 * @author Wahib-Ul-Haq, wahib.tech@gmail.com, 2014
 * 
 *
 * contains code taken from:
 * 
 * "Lane detection using OpenCV" 
 * https://github.com/jdorweiler/lane-detection
 * Acknowledgments: jdorweiler
 * Contact: jason@transistor.io
 */

#if !defined LINEF
#define LINEF

#include <opencv2/core/core.hpp>
#include <opencv2/imgproc/imgproc.hpp>

#include <android/log.h>
#include "LaneCalculations.cpp"
#include <cmath>
#include <iomanip>

#define PI 3.1415926

using namespace cv;
using namespace std;

class LineFinder {

  private:

	  // original image
	  Mat img;

	  // vector containing the end points 
	  // of the detected lines
	  vector<Vec4i> lines;

	  // accumulator resolution parameters
	  double deltaRho;
	  double deltaTheta;

	  // minimum number of votes that a line must receive before being considered.
	  //The minimum number of intersections to “detect” a line
	  int minVote;

	  // min length for a line
	  double minLength;

	  // max allowed gap along the line
	  double maxGap;

	  // distance to shift the drawn lines down when using a ROI
	  int shift;




  public:

	  // Default accumulator resolution is 1 pixel by 1 degree
	  // no gap, no mimimum length
	  LineFinder() : deltaRho(1), deltaTheta(PI/180), minVote(10), minLength(0.), maxGap(0.){}



	  // Set the resolution of the accumulator
	  void setAccResolution(double dRho, double dTheta) {

		  deltaRho= dRho;
		  deltaTheta= dTheta;
	  }

	  // Set the minimum number of votes
	  void setMinVote(int minv) {

		  minVote= minv;
	  }

	  // Set line length and gap
	  void setLineLengthAndGap(double length, double gap) {

		  minLength= length;
		  maxGap= gap;
	  }

	  // set image shift
	  void setShift(int imgShift) {

		  shift = imgShift;
	  }

	  // Apply probabilistic Hough Transform
	  vector<Vec4i> findLines(Mat& binary) {

		  lines.clear();
		  HoughLinesP(binary,lines,deltaRho,deltaTheta,minVote, minLength, maxGap);

		  return lines;
	  }

	  // Draw the detected lines on an image
	  void drawDetectedLines(Mat &image, Scalar color=Scalar(255)) {
		
		  // Draw the lines
		  vector<Vec4i>::const_iterator it2= lines.begin();



		  while (it2!=lines.end()) {
		
			  Point pt1((*it2)[0],(*it2)[1]+shift); //end coordinate
			  Point pt2((*it2)[2],(*it2)[3]+shift); //start coordinate


			  //This is to draw the line with end points
			  line( image, pt1, pt2, color, 10 );
			  //cout << " HoughP line: ("<< pt1 <<"," << pt2 << ")\n";

			  ///This chunk of code is commented to disable SDLP calculation and display of its values///

			  /*
			  int Houghpt2x = (*it2)[2];

			  //__android_log_print(ANDROID_LOG_ERROR, "HoughP line point 2", "Lane Type: %s, Value: %d", "Left Most Lane", Houghpt2x);

			  int laneStatus = -1;
			  stringstream stream;


			  if(Houghpt2x >= 100 && Houghpt2x < 180 )
			  {
				  laneStatus = 3;
				  __android_log_print(ANDROID_LOG_ERROR, "HoughP line point 2", "Lane Type: %s, Value: %d", "Left Lane", Houghpt2x);
				  stream << "Lane Status : " << "Left lane";

			  }
			  else if(Houghpt2x >= 180 && Houghpt2x <= 220 )
			  {
				  laneStatus = 2;
				  __android_log_print(ANDROID_LOG_ERROR, "HoughP line point 2", "Lane Type: %s, Value: %d", "Switching ..", Houghpt2x);
				  stream << "Lane Status : " << "Switching ..";

			  }
			  else if(Houghpt2x > 220 && Houghpt2x <= 450 )
			  {
				  laneStatus = 1;
				  __android_log_print(ANDROID_LOG_ERROR, "HoughP line point 2", "Lane Type: %s, Value : %d", "Right Lane", Houghpt2x);
				  stream << "Lane Status : " << "Right lane";

			  }

			  //int LateralPosition = Houghpt2x - 300 - 75;
			  //average width of car is 1.8 m
			  //average width of double lane road is 3.3 * 2 = 6.6 m

			  //e.g 450 x value = 1.65 lateral position value
			  //e.g 350 x value = 1.89
			  //scaling has 0 at left most that is the 0 for x coordinate as well

			  //average vehicle width considered is 152 cm or 1.52 m and fixed lane width is used as 365 cm or 3.65 m

			  double singleLaneWidth = 3.65; double avgCarWidth = 1.52;
			  int lowerBound = 100; int upperBound = 450; //range of x coordinate of Hought Point
			  double bestLateralPosition = avgCarWidth/2 + (((singleLaneWidth/2) - avgCarWidth)/2); // 0.915 - single lane //1.65 - when 2 lanes were considered


			 //x coordinate of Hough point is inverseley proportional to lateral position
			  double k = upperBound * bestLateralPosition;
			  double lateralPosition = 0;
			  if(Houghpt2x > 450)
				  lateralPosition = bestLateralPosition;
			  else if(Houghpt2x < 100)
				  lateralPosition = singleLaneWidth;
			  else
				  lateralPosition = k / Houghpt2x;


			  //preparing for SDLP
			  if(lateralPosition > 0)
			  {
				  //calculating lateral position value for each instance
				  lateralPosition = floor(lateralPosition*100 + 0.5)/100; //rounding off to 2 d.p

				  //rounding off to 2 d.p



				  //sumLateralPosition += lateralPosition;
				  //arrayLateralPosition[countLateralPosition] = lateralPosition;
				  //++countLateralPosition;

				  LaneCalculations::Instance()->sumLateralPosition += lateralPosition;
				  LaneCalculations::Instance()->arrayLateralPosition[LaneCalculations::Instance()->countLateralPosition] = lateralPosition;
				  ++LaneCalculations::Instance()->countLateralPosition;

				  __android_log_print(ANDROID_LOG_ERROR, "Line Finder", "count: %d", LaneCalculations::Instance()->countLateralPosition);


				  //displaying output
				  stringstream stream1;
				  stream1 << "Lateral position : " << setprecision(3) << lateralPosition;
				  __android_log_print(ANDROID_LOG_ERROR, "Line Finder", "Lateral Position: %f", lateralPosition);

				  //displaying values on screen
				  putText(image, stream1.str(), Point(50,image.rows-70), 1, 1, Scalar(0,255,255),0); //lateral position
				  putText(image, stream.str(), Point(50,image.rows-30), 1, 1, Scalar(0,255,255),0);  //lane status


				  //displaying sdlp value which is in m. ideal is somewhere around 0.30 m for one lane. This SDLP shows value
				  //after considerign 2 lanes -> 6.6 m
				  if(LaneCalculations::Instance()->countLateralPosition >= 1000)
				  {
					  __android_log_print(ANDROID_LOG_ERROR, "Line Finder", "SDLP: %f", LaneCalculations::Instance()->calculateSDLP());
				  	  stringstream stream2;
					  stream2 << setprecision(3) << "SDLP : " << LaneCalculations::Instance()->calculateSDLP();
				  	  putText(image, stream2.str(), Point(50,image.rows-110), 1, 1, Scalar(0,255,255),0);
				  }






			  }

			  */


			  ++it2;	
		  }
	  }


	  // Eliminates lines that do not have an orientation equals to
	  // the ones specified in the input matrix of orientations
	  // At least the given percentage of pixels on the line must 
	  // be within plus or minus delta of the corresponding orientation
	  vector<Vec4i> removeLinesOfInconsistentOrientations(
		  const Mat &orientations, double percentage, double delta) {

			  vector<Vec4i>::iterator it= lines.begin();
	
			  // check all lines
			  while (it!=lines.end()) {

				  // end points
				  int x1= (*it)[0];
				  int y1= (*it)[1];
				  int x2= (*it)[2];
				  int y2= (*it)[3];
		   
				  // line orientation + 90o to get the parallel line
				  double ori1= atan2(static_cast<double>(y1-y2),static_cast<double>(x1-x2))+PI/2;
				  if (ori1>PI) ori1= ori1-2*PI;

				  double ori2= atan2(static_cast<double>(y2-y1),static_cast<double>(x2-x1))+PI/2;
				  if (ori2>PI) ori2= ori2-2*PI;
	
				  // for all points on the line
				  LineIterator lit(orientations,Point(x1,y1),Point(x2,y2));
				  int i,count=0;
				  for(i = 0, count=0; i < lit.count; i++, ++lit) { 
		
					  float ori= *(reinterpret_cast<float *>(*lit));

					  // is line orientation similar to gradient orientation ?
					  if (min(fabs(ori-ori1),fabs(ori-ori2))<delta)
						  count++;
		
				  }

				  double consistency= count/static_cast<double>(i);

				  // set to zero lines of inconsistent orientation
				  if (consistency < percentage) {
 
					  (*it)[0]=(*it)[1]=(*it)[2]=(*it)[3]=0;

				  }

				  ++it;
			  }

			  return lines;
	  }
};


#endif
